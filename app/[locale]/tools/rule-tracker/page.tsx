'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DemoBanner } from '@/components/DemoBanner';

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
    allTools: 'All Tools',
    title: 'Rule Checker',
    subtitle: 'Check if your trade plan complies with prop firm rules',
    quickComparison: 'Quick Rules Comparison',
    firm: 'Firm',
    news: 'News',
    weekend: 'Weekend',
    consistency: 'Consistency',
    ddType: 'DD Type',
    static: 'Static',
    trailing: 'Trailing',
    none: 'None',
    selectPropFirm: 'Select Prop Firm',
    yourTradePlan: 'Your Trade Plan',
    checkApplies: 'Check what applies to your planned trade:',
    tradingAroundNews: 'Trading around news time',
    highImpactEvents: 'High-impact economic events',
    holdingWeekend: 'Holding over weekend',
    positionsOpenFriMon: 'Positions open Friday → Monday',
    largeProfitDay: 'Large profit day planned',
    expecting30: 'Expecting >30% of target in one day',
    usingHedging: 'Using hedging',
    oppositePositions: 'Opposite positions on same pair',
    allClear: 'All Clear',
    ruleViolations: 'Rule Violations',
    warnings: 'Warnings',
    planComplies: 'Your plan complies with all',
    rules: 'rules',
    firmRules: 'Rules',
    newsTrading: 'News Trading',
    allowed: 'Allowed',
    minBuffer: 'min buffer',
    weekendHolding: 'Weekend Holding',
    notAllowed: 'Not Allowed',
    consistencyRule: 'Consistency Rule',
    maxDDType: 'Max DD Type',
    minTradingDays: 'Min Trading Days',
    days: 'days',
    ctaTitle: 'Auto-Check Every Trade',
    ctaDesc: 'My Prop Firms automatically verifies your trades against all rules in real-time using your actual account data.',
    tryFree: 'Try My Prop Firms Free',
    doesNotAllow: 'does not allow trading',
    minutesAround: 'minutes around high-impact news',
    doesNotAllowWeekend: 'does not allow holding positions over the weekend',
    hasConsistency: 'has a',
    consistencyRuleNote: 'consistency rule — large profit days may count against you',
    hedgingVaries: 'Hedging rules vary — check your specific prop firm terms',
  },
  fr: {
    allTools: 'Tous les Outils',
    title: 'Vérificateur de Règles',
    subtitle: 'Vérifiez si votre plan de trading respecte les règles des prop firms',
    quickComparison: 'Comparaison Rapide des Règles',
    firm: 'Firm',
    news: 'News',
    weekend: 'Weekend',
    consistency: 'Consistance',
    ddType: 'Type DD',
    static: 'Statique',
    trailing: 'Trailing',
    none: 'Aucune',
    selectPropFirm: 'Sélectionner une Prop Firm',
    yourTradePlan: 'Votre Plan de Trading',
    checkApplies: 'Cochez ce qui s\'applique à votre trade planifié :',
    tradingAroundNews: 'Trading pendant les news',
    highImpactEvents: 'Événements économiques à fort impact',
    holdingWeekend: 'Maintien le weekend',
    positionsOpenFriMon: 'Positions ouvertes vendredi → lundi',
    largeProfitDay: 'Journée de gros profit prévue',
    expecting30: 'Attendant >30% de l\'objectif en un jour',
    usingHedging: 'Utilisation du hedging',
    oppositePositions: 'Positions opposées sur la même paire',
    allClear: 'Tout est OK',
    ruleViolations: 'Violations de Règles',
    warnings: 'Avertissements',
    planComplies: 'Votre plan respecte toutes les règles de',
    rules: '',
    firmRules: 'Règles',
    newsTrading: 'Trading de News',
    allowed: 'Autorisé',
    minBuffer: 'min buffer',
    weekendHolding: 'Maintien Weekend',
    notAllowed: 'Non Autorisé',
    consistencyRule: 'Règle de Consistance',
    maxDDType: 'Type DD Max',
    minTradingDays: 'Jours de Trading Min',
    days: 'jours',
    ctaTitle: 'Vérification Auto de Chaque Trade',
    ctaDesc: 'My Prop Firms vérifie automatiquement vos trades contre toutes les règles en temps réel.',
    tryFree: 'Essayer My Prop Firms Gratuitement',
    doesNotAllow: 'n\'autorise pas le trading',
    minutesAround: 'minutes autour des news à fort impact',
    doesNotAllowWeekend: 'n\'autorise pas le maintien de positions le weekend',
    hasConsistency: 'a une règle de consistance de',
    consistencyRuleNote: '— les journées de gros profits peuvent compter contre vous',
    hedgingVaries: 'Les règles de hedging varient — vérifiez les termes de votre prop firm',
  },
  de: {
    allTools: 'Alle Tools',
    title: 'Regel-Checker',
    subtitle: 'Prüfen Sie, ob Ihr Handelsplan den Prop-Firm-Regeln entspricht',
    quickComparison: 'Schneller Regelvergleich',
    firm: 'Firma',
    news: 'News',
    weekend: 'Wochenende',
    consistency: 'Konsistenz',
    ddType: 'DD-Typ',
    static: 'Statisch',
    trailing: 'Trailing',
    none: 'Keine',
    selectPropFirm: 'Prop Firm Auswählen',
    yourTradePlan: 'Ihr Handelsplan',
    checkApplies: 'Markieren Sie, was für Ihren geplanten Trade gilt:',
    tradingAroundNews: 'Handel um Nachrichtenzeit',
    highImpactEvents: 'Wirtschaftsereignisse mit hoher Auswirkung',
    holdingWeekend: 'Über Wochenende halten',
    positionsOpenFriMon: 'Positionen offen Freitag → Montag',
    largeProfitDay: 'Großer Gewinntag geplant',
    expecting30: 'Erwarte >30% des Ziels an einem Tag',
    usingHedging: 'Hedging nutzen',
    oppositePositions: 'Gegenpositionen auf gleichem Paar',
    allClear: 'Alles OK',
    ruleViolations: 'Regelverstöße',
    warnings: 'Warnungen',
    planComplies: 'Ihr Plan entspricht allen Regeln von',
    rules: '',
    firmRules: 'Regeln',
    newsTrading: 'News-Trading',
    allowed: 'Erlaubt',
    minBuffer: 'min Puffer',
    weekendHolding: 'Wochenend-Halten',
    notAllowed: 'Nicht Erlaubt',
    consistencyRule: 'Konsistenzregel',
    maxDDType: 'Max DD-Typ',
    minTradingDays: 'Min Handelstage',
    days: 'Tage',
    ctaTitle: 'Auto-Check für Jeden Trade',
    ctaDesc: 'My Prop Firms überprüft Ihre Trades automatisch in Echtzeit gegen alle Regeln.',
    tryFree: 'My Prop Firms Kostenlos Testen',
    doesNotAllow: 'erlaubt kein Trading',
    minutesAround: 'Minuten um wichtige Nachrichten',
    doesNotAllowWeekend: 'erlaubt kein Halten von Positionen über das Wochenende',
    hasConsistency: 'hat eine Konsistenzregel von',
    consistencyRuleNote: '— große Gewinntage können gegen Sie zählen',
    hedgingVaries: 'Hedging-Regeln variieren — prüfen Sie Ihre Prop-Firm-Bedingungen',
  },
  es: {
    allTools: 'Todas las Herramientas',
    title: 'Verificador de Reglas',
    subtitle: 'Verifica si tu plan de trading cumple con las reglas de las prop firms',
    quickComparison: 'Comparación Rápida de Reglas',
    firm: 'Firma',
    news: 'Noticias',
    weekend: 'Fin de Semana',
    consistency: 'Consistencia',
    ddType: 'Tipo DD',
    static: 'Estático',
    trailing: 'Trailing',
    none: 'Ninguna',
    selectPropFirm: 'Seleccionar Prop Firm',
    yourTradePlan: 'Tu Plan de Trading',
    checkApplies: 'Marca lo que aplica a tu trade planificado:',
    tradingAroundNews: 'Trading durante noticias',
    highImpactEvents: 'Eventos económicos de alto impacto',
    holdingWeekend: 'Mantener el fin de semana',
    positionsOpenFriMon: 'Posiciones abiertas viernes → lunes',
    largeProfitDay: 'Día de gran ganancia planeado',
    expecting30: 'Esperando >30% del objetivo en un día',
    usingHedging: 'Usando hedging',
    oppositePositions: 'Posiciones opuestas en el mismo par',
    allClear: 'Todo OK',
    ruleViolations: 'Violaciones de Reglas',
    warnings: 'Advertencias',
    planComplies: 'Tu plan cumple con todas las reglas de',
    rules: '',
    firmRules: 'Reglas',
    newsTrading: 'Trading de Noticias',
    allowed: 'Permitido',
    minBuffer: 'min buffer',
    weekendHolding: 'Mantener Fin de Semana',
    notAllowed: 'No Permitido',
    consistencyRule: 'Regla de Consistencia',
    maxDDType: 'Tipo DD Máx',
    minTradingDays: 'Días Mín de Trading',
    days: 'días',
    ctaTitle: 'Verificación Auto de Cada Trade',
    ctaDesc: 'My Prop Firms verifica automáticamente tus trades contra todas las reglas en tiempo real.',
    tryFree: 'Probar My Prop Firms Gratis',
    doesNotAllow: 'no permite trading',
    minutesAround: 'minutos alrededor de noticias de alto impacto',
    doesNotAllowWeekend: 'no permite mantener posiciones durante el fin de semana',
    hasConsistency: 'tiene una regla de consistencia de',
    consistencyRuleNote: '— los días de grandes ganancias pueden contar en tu contra',
    hedgingVaries: 'Las reglas de hedging varían — revisa los términos de tu prop firm',
  },
  pt: {
    allTools: 'Todas as Ferramentas',
    title: 'Verificador de Regras',
    subtitle: 'Verifique se seu plano de trading cumpre as regras das prop firms',
    quickComparison: 'Comparação Rápida de Regras',
    firm: 'Firma',
    news: 'Notícias',
    weekend: 'Fim de Semana',
    consistency: 'Consistência',
    ddType: 'Tipo DD',
    static: 'Estático',
    trailing: 'Trailing',
    none: 'Nenhuma',
    selectPropFirm: 'Selecionar Prop Firm',
    yourTradePlan: 'Seu Plano de Trading',
    checkApplies: 'Marque o que se aplica ao seu trade planejado:',
    tradingAroundNews: 'Trading durante notícias',
    highImpactEvents: 'Eventos econômicos de alto impacto',
    holdingWeekend: 'Manter no fim de semana',
    positionsOpenFriMon: 'Posições abertas sexta → segunda',
    largeProfitDay: 'Dia de grande lucro planejado',
    expecting30: 'Esperando >30% da meta em um dia',
    usingHedging: 'Usando hedging',
    oppositePositions: 'Posições opostas no mesmo par',
    allClear: 'Tudo OK',
    ruleViolations: 'Violações de Regras',
    warnings: 'Avisos',
    planComplies: 'Seu plano cumpre todas as regras da',
    rules: '',
    firmRules: 'Regras',
    newsTrading: 'Trading de Notícias',
    allowed: 'Permitido',
    minBuffer: 'min buffer',
    weekendHolding: 'Manter Fim de Semana',
    notAllowed: 'Não Permitido',
    consistencyRule: 'Regra de Consistência',
    maxDDType: 'Tipo DD Máx',
    minTradingDays: 'Dias Mín de Trading',
    days: 'dias',
    ctaTitle: 'Verificação Auto de Cada Trade',
    ctaDesc: 'My Prop Firms verifica automaticamente seus trades contra todas as regras em tempo real.',
    tryFree: 'Experimentar My Prop Firms Grátis',
    doesNotAllow: 'não permite trading',
    minutesAround: 'minutos em torno de notícias de alto impacto',
    doesNotAllowWeekend: 'não permite manter posições durante o fim de semana',
    hasConsistency: 'tem uma regra de consistência de',
    consistencyRuleNote: '— dias de grandes lucros podem contar contra você',
    hedgingVaries: 'As regras de hedging variam — verifique os termos da sua prop firm',
  },
  ar: {
    allTools: 'جميع الأدوات',
    title: 'مدقق القواعد',
    subtitle: 'تحقق مما إذا كانت خطة التداول الخاصة بك تتوافق مع قواعد شركات التداول',
    quickComparison: 'مقارنة سريعة للقواعد',
    firm: 'الشركة',
    news: 'الأخبار',
    weekend: 'نهاية الأسبوع',
    consistency: 'الاتساق',
    ddType: 'نوع DD',
    static: 'ثابت',
    trailing: 'متحرك',
    none: 'لا يوجد',
    selectPropFirm: 'اختر شركة التداول',
    yourTradePlan: 'خطة التداول الخاصة بك',
    checkApplies: 'حدد ما ينطبق على صفقتك المخططة:',
    tradingAroundNews: 'التداول وقت الأخبار',
    highImpactEvents: 'أحداث اقتصادية عالية التأثير',
    holdingWeekend: 'الاحتفاظ خلال نهاية الأسبوع',
    positionsOpenFriMon: 'مراكز مفتوحة الجمعة ← الاثنين',
    largeProfitDay: 'يوم ربح كبير مخطط',
    expecting30: 'توقع >30% من الهدف في يوم واحد',
    usingHedging: 'استخدام التحوط',
    oppositePositions: 'مراكز معاكسة على نفس الزوج',
    allClear: 'كل شيء على ما يرام',
    ruleViolations: 'انتهاكات القواعد',
    warnings: 'تحذيرات',
    planComplies: 'خطتك تتوافق مع جميع قواعد',
    rules: '',
    firmRules: 'القواعد',
    newsTrading: 'تداول الأخبار',
    allowed: 'مسموح',
    minBuffer: 'دقيقة فاصلة',
    weekendHolding: 'الاحتفاظ نهاية الأسبوع',
    notAllowed: 'غير مسموح',
    consistencyRule: 'قاعدة الاتساق',
    maxDDType: 'نوع DD الأقصى',
    minTradingDays: 'أيام التداول الدنيا',
    days: 'أيام',
    ctaTitle: 'فحص تلقائي لكل صفقة',
    ctaDesc: 'My Prop Firms يتحقق تلقائياً من صفقاتك مقابل جميع القواعد في الوقت الفعلي.',
    tryFree: 'جرب My Prop Firms مجاناً',
    doesNotAllow: 'لا يسمح بالتداول',
    minutesAround: 'دقائق حول الأخبار عالية التأثير',
    doesNotAllowWeekend: 'لا يسمح بالاحتفاظ بالمراكز خلال نهاية الأسبوع',
    hasConsistency: 'لديه قاعدة اتساق',
    consistencyRuleNote: '— أيام الأرباح الكبيرة قد تحسب ضدك',
    hedgingVaries: 'قواعد التحوط تختلف — تحقق من شروط شركتك',
  },
  hi: {
    allTools: 'सभी टूल्स',
    title: 'नियम चेकर',
    subtitle: 'जांचें कि आपकी ट्रेडिंग योजना प्रॉप फर्म के नियमों का पालन करती है या नहीं',
    quickComparison: 'त्वरित नियम तुलना',
    firm: 'फर्म',
    news: 'न्यूज',
    weekend: 'वीकेंड',
    consistency: 'कंसिस्टेंसी',
    ddType: 'DD प्रकार',
    static: 'स्टैटिक',
    trailing: 'ट्रेलिंग',
    none: 'कोई नहीं',
    selectPropFirm: 'प्रॉप फर्म चुनें',
    yourTradePlan: 'आपकी ट्रेड योजना',
    checkApplies: 'अपने नियोजित ट्रेड पर जो लागू हो उसे चुनें:',
    tradingAroundNews: 'न्यूज के समय ट्रेडिंग',
    highImpactEvents: 'उच्च प्रभाव वाली आर्थिक घटनाएं',
    holdingWeekend: 'वीकेंड में होल्ड करना',
    positionsOpenFriMon: 'पोजीशन खुली शुक्रवार → सोमवार',
    largeProfitDay: 'बड़े प्रॉफिट का दिन नियोजित',
    expecting30: 'एक दिन में >30% लक्ष्य की उम्मीद',
    usingHedging: 'हेजिंग का उपयोग',
    oppositePositions: 'एक ही पेयर पर विपरीत पोजीशन',
    allClear: 'सब ठीक है',
    ruleViolations: 'नियम उल्लंघन',
    warnings: 'चेतावनियां',
    planComplies: 'आपकी योजना सभी नियमों का पालन करती है',
    rules: '',
    firmRules: 'नियम',
    newsTrading: 'न्यूज ट्रेडिंग',
    allowed: 'अनुमति है',
    minBuffer: 'मिनट बफर',
    weekendHolding: 'वीकेंड होल्डिंग',
    notAllowed: 'अनुमति नहीं',
    consistencyRule: 'कंसिस्टेंसी नियम',
    maxDDType: 'मैक्स DD प्रकार',
    minTradingDays: 'न्यूनतम ट्रेडिंग दिन',
    days: 'दिन',
    ctaTitle: 'हर ट्रेड का ऑटो-चेक',
    ctaDesc: 'My Prop Firms स्वचालित रूप से आपके ट्रेड्स को रियल-टाइम में सभी नियमों के खिलाफ सत्यापित करता है।',
    tryFree: 'My Prop Firms मुफ्त आज़माएं',
    doesNotAllow: 'ट्रेडिंग की अनुमति नहीं देता',
    minutesAround: 'मिनट उच्च प्रभाव समाचार के आसपास',
    doesNotAllowWeekend: 'वीकेंड पर पोजीशन होल्ड करने की अनुमति नहीं देता',
    hasConsistency: 'की कंसिस्टेंसी नियम है',
    consistencyRuleNote: '— बड़े प्रॉफिट के दिन आपके खिलाफ गिने जा सकते हैं',
    hedgingVaries: 'हेजिंग नियम अलग-अलग हैं — अपनी प्रॉप फर्म की शर्तें जांचें',
  },
};

const propFirmRules: Record<string, {
  newsTrading: boolean;
  newsBuffer: number;
  weekendHolding: boolean;
  consistency: number | null;
  maxDDType: 'static' | 'trailing';
  minTradingDays: number;
}> = {
  'FTMO': { newsTrading: false, newsBuffer: 2, weekendHolding: true, consistency: null, maxDDType: 'static', minTradingDays: 4 },
  'FundedNext': { newsTrading: false, newsBuffer: 5, weekendHolding: true, consistency: 40, maxDDType: 'trailing', minTradingDays: 5 },
  'The5ers': { newsTrading: true, newsBuffer: 0, weekendHolding: false, consistency: null, maxDDType: 'static', minTradingDays: 3 },
  'MyFundedFX': { newsTrading: false, newsBuffer: 2, weekendHolding: true, consistency: 45, maxDDType: 'trailing', minTradingDays: 5 },
  'E8 Funding': { newsTrading: false, newsBuffer: 5, weekendHolding: true, consistency: null, maxDDType: 'static', minTradingDays: 5 },
};

const firms = Object.keys(propFirmRules);

export default function RuleTrackerPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [selectedFirm, setSelectedFirm] = useState('FTMO');
  const [tradingNews, setTradingNews] = useState(false);
  const [holdingWeekend, setHoldingWeekend] = useState(false);
  const [largeProfitDay, setLargeProfitDay] = useState(false);
  const [usingHedging, setUsingHedging] = useState(false);

  const rules = propFirmRules[selectedFirm];

  const violations: string[] = [];
  const warnings: string[] = [];

  if (tradingNews && !rules.newsTrading) {
    violations.push(`${selectedFirm} ${t.doesNotAllow} ${rules.newsBuffer} ${t.minutesAround}`);
  }

  if (holdingWeekend && !rules.weekendHolding) {
    violations.push(`${selectedFirm} ${t.doesNotAllowWeekend}`);
  }

  if (largeProfitDay && rules.consistency) {
    warnings.push(`${selectedFirm} ${t.hasConsistency} ${rules.consistency}% ${t.consistencyRuleNote}`);
  }

  if (usingHedging) {
    warnings.push(t.hedgingVaries);
  }

  const isCompliant = violations.length === 0;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href={`/${locale}/tools`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t.allTools}
        </Link>

        <DemoBanner toolName="rule checker" />

        <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.subtitle}</p>

        {/* Quick Comparison Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-white mb-4">{t.quickComparison}</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="pb-2 pr-4">{t.firm}</th>
                <th className="pb-2 px-2 text-center">{t.news}</th>
                <th className="pb-2 px-2 text-center">{t.weekend}</th>
                <th className="pb-2 px-2 text-center">{t.consistency}</th>
                <th className="pb-2 pl-2 text-center">{t.ddType}</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((firm) => {
                const r = propFirmRules[firm];
                return (
                  <tr key={firm} className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 text-white font-medium">{firm}</td>
                    <td className="py-2 px-2 text-center">
                      {r.newsTrading ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {r.weekendHolding ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-2 px-2 text-center text-gray-400">
                      {r.consistency ? `${r.consistency}%` : t.none}
                    </td>
                    <td className="py-2 pl-2 text-center">
                      <span className={r.maxDDType === 'static' ? 'text-emerald-400' : 'text-purple-400'}>
                        {r.maxDDType === 'static' ? t.static : t.trailing}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Firm Selector */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t.selectPropFirm}</h2>
          <div className="flex flex-wrap gap-2">
            {firms.map((firm) => (
              <button
                key={firm}
                onClick={() => setSelectedFirm(firm)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFirm === firm
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {firm}
              </button>
            ))}
          </div>
        </div>

        {/* Trade Plan Checkboxes */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t.yourTradePlan}</h2>
          <p className="text-sm text-gray-500 mb-4">{t.checkApplies}</p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={tradingNews}
                onChange={(e) => setTradingNews(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">{t.tradingAroundNews}</p>
                <p className="text-xs text-gray-500">{t.highImpactEvents}</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={holdingWeekend}
                onChange={(e) => setHoldingWeekend(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">{t.holdingWeekend}</p>
                <p className="text-xs text-gray-500">{t.positionsOpenFriMon}</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={largeProfitDay}
                onChange={(e) => setLargeProfitDay(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">{t.largeProfitDay}</p>
                <p className="text-xs text-gray-500">{t.expecting30}</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={usingHedging}
                onChange={(e) => setUsingHedging(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">{t.usingHedging}</p>
                <p className="text-xs text-gray-500">{t.oppositePositions}</p>
              </div>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className={`p-4 rounded-lg border ${
            isCompliant && warnings.length === 0
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : violations.length > 0
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {isCompliant && warnings.length === 0 ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <p className="font-semibold text-emerald-400">{t.allClear}</p>
                </>
              ) : violations.length > 0 ? (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <p className="font-semibold text-red-400">{t.ruleViolations}</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <p className="font-semibold text-yellow-400">{t.warnings}</p>
                </>
              )}
            </div>

            {violations.length > 0 && (
              <ul className="space-y-1 mb-3">
                {violations.map((v, i) => (
                  <li key={i} className="text-sm text-red-300">• {v}</li>
                ))}
              </ul>
            )}

            {warnings.length > 0 && (
              <ul className="space-y-1">
                {warnings.map((w, i) => (
                  <li key={i} className="text-sm text-yellow-300">• {w}</li>
                ))}
              </ul>
            )}

            {isCompliant && warnings.length === 0 && (
              <p className="text-sm text-emerald-300">{t.planComplies} {selectedFirm} {t.rules}</p>
            )}
          </div>
        </div>

        {/* Selected Firm Rules */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">{selectedFirm} {t.firmRules}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">{t.newsTrading}</p>
              <p className={`font-medium ${rules.newsTrading ? 'text-emerald-400' : 'text-red-400'}`}>
                {rules.newsTrading ? t.allowed : `${rules.newsBuffer}${t.minBuffer}`}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">{t.weekendHolding}</p>
              <p className={`font-medium ${rules.weekendHolding ? 'text-emerald-400' : 'text-red-400'}`}>
                {rules.weekendHolding ? t.allowed : t.notAllowed}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">{t.consistencyRule}</p>
              <p className="font-medium text-gray-300">
                {rules.consistency ? `${rules.consistency}%` : t.none}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">{t.maxDDType}</p>
              <p className={`font-medium ${rules.maxDDType === 'static' ? 'text-emerald-400' : 'text-purple-400'}`}>
                {rules.maxDDType === 'static' ? t.static : t.trailing}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 col-span-2">
              <p className="text-xs text-gray-500">{t.minTradingDays}</p>
              <p className="font-medium text-gray-300">{rules.minTradingDays} {t.days}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-gray-900 rounded-xl border border-emerald-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">{t.ctaTitle}</h3>
          <p className="text-gray-400 mb-4">{t.ctaDesc}</p>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            <Shield className="w-5 h-5" />
            {t.tryFree}
          </Link>
        </div>
      </div>
    </div>
  );
}
