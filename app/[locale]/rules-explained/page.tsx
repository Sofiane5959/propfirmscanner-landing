'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Home, ChevronRight, FileText, Lock, Search,
  CheckCircle2, AlertTriangle, Download, Play, HelpCircle,
  ArrowRight, Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// =============================================================================
// PROP FIRMS DATA
// =============================================================================
// Les guides ne sont pas encore publies : aucune page/checkout par firme n'existe.
// `rulesCount` etait code en dur sans source : retire de l'UI (et des donnees).

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const propFirms: { id: string; name: string; difficulty: Difficulty; popular: boolean }[] = [
  { id: 'ftmo', name: 'FTMO', difficulty: 'Medium', popular: true },
  { id: 'fundednext', name: 'FundedNext', difficulty: 'Easy', popular: true },
  { id: 'the5ers', name: 'The5ers', difficulty: 'Medium', popular: true },
  { id: 'myfundedfx', name: 'MyFundedFX', difficulty: 'Easy', popular: false },
  { id: 'e8-funding', name: 'E8 Funding', difficulty: 'Medium', popular: false },
  { id: 'alpha-capital', name: 'Alpha Capital', difficulty: 'Easy', popular: false },
  { id: 'funded-trading-plus', name: 'Funded Trading Plus', difficulty: 'Medium', popular: false },
  { id: 'fxify', name: 'FXIFY', difficulty: 'Easy', popular: false },
  { id: 'topstep', name: 'Topstep', difficulty: 'Hard', popular: true },
  { id: 'goat-funded', name: 'Goat Funded Trader', difficulty: 'Medium', popular: false },
  { id: 'blue-guardian', name: 'Blue Guardian', difficulty: 'Medium', popular: false },
  { id: 'true-forex-funds', name: 'True Forex Funds', difficulty: 'Medium', popular: false },
];

// Prix affiches par le code existant (guides et pack non encore en vente).
const GUIDE_PRICE = '$4.99';
const BUNDLE_PRICE = '$49.99';

// =============================================================================
// I18N
// =============================================================================

const T = {
  en: {
    home: 'Home',
    crumb: 'Rules explained',
    title: 'Prop firm rules, decoded',
    subtitle: 'One guide per prop firm covering every rule that can cost you an account: drawdown, consistency, news, weekends, payouts — in plain words.',
    trustFirms: 'prop firms listed',
    trustPrice: 'per guide',
    trustSoon: 'Guides in preparation',
    whatTitle: 'What each guide includes',
    whatYouGet: [
      { title: 'Complete rule breakdown', description: 'Every single rule explained in plain English, no confusing jargon.' },
      { title: 'Common pitfalls', description: 'The mistakes that most often make traders fail with this firm.' },
      { title: 'Compliance checklist', description: 'A simple checklist to verify you are following all rules.' },
      { title: 'Video walkthrough', description: 'A video explanation of the most complex rules.' },
      { title: 'PDF download', description: 'Download the guide to reference offline anytime.' },
      { title: 'Q&A section', description: 'Answers to the most frequently asked questions.' },
    ],
    chooseTitle: 'Choose your prop firm',
    chooseSub: 'Each guide will cost',
    searchPlaceholder: 'Search a prop firm…',
    searchLabel: 'Search a prop firm',
    soonBanner: 'Guides are not available yet — they are launching soon.',
    popular: 'Popular',
    soon: 'Soon',
    rules: { Easy: 'Easy rules', Medium: 'Medium rules', Hard: 'Hard rules' } as Record<Difficulty, string>,
    getGuide: 'Get the guide',
    noResults: 'No prop firm matches',
    bundleTag: 'All-access bundle',
    bundleTitle: 'Every rule guide in one pack',
    bundleText: 'Access to all prop firm rule guides for a single price.',
    getAll: 'Get all guides',
    ctaTitle: "Don't risk your challenge",
    ctaText: "Many challenges are lost on a rule the trader didn't fully understand. While the guides are being prepared, our free articles cover the key rules.",
    ctaPrimary: 'Read free articles',
    ctaSecondary: 'Compare prop firms',
  },
  fr: {
    home: 'Accueil',
    crumb: 'Règles expliquées',
    title: 'Les règles des prop firms, décodées',
    subtitle: 'Un guide par prop firm qui détaille chaque règle pouvant te faire perdre un compte : drawdown, consistance, news, week-end, payouts — en mots simples.',
    trustFirms: 'prop firms listées',
    trustPrice: 'par guide',
    trustSoon: 'Guides en préparation',
    whatTitle: 'Ce que contient chaque guide',
    whatYouGet: [
      { title: 'Toutes les règles détaillées', description: 'Chaque règle expliquée simplement, sans jargon.' },
      { title: 'Pièges fréquents', description: 'Les erreurs qui font le plus souvent échouer chez cette firme.' },
      { title: 'Checklist de conformité', description: 'Une checklist simple pour vérifier que tu respectes toutes les règles.' },
      { title: 'Vidéo explicative', description: 'Une vidéo pour les règles les plus complexes.' },
      { title: 'PDF téléchargeable', description: 'Télécharge le guide pour le consulter hors ligne.' },
      { title: 'Questions-réponses', description: 'Les réponses aux questions les plus fréquentes.' },
    ],
    chooseTitle: 'Choisis ta prop firm',
    chooseSub: 'Chaque guide coûtera',
    searchPlaceholder: 'Rechercher une prop firm…',
    searchLabel: 'Rechercher une prop firm',
    soonBanner: 'Les guides ne sont pas encore disponibles — ils arrivent bientôt.',
    popular: 'Populaire',
    soon: 'Bientôt',
    rules: { Easy: 'Règles simples', Medium: 'Règles moyennes', Hard: 'Règles strictes' } as Record<Difficulty, string>,
    getGuide: 'Obtenir le guide',
    noResults: 'Aucune prop firm ne correspond à',
    bundleTag: 'Pack intégral',
    bundleTitle: 'Tous les guides de règles en un pack',
    bundleText: 'Accès à tous les guides de règles des prop firms pour un prix unique.',
    getAll: 'Obtenir tous les guides',
    ctaTitle: 'Ne risque pas ton challenge',
    ctaText: "Beaucoup de challenges se perdent sur une règle mal comprise. En attendant les guides, nos articles gratuits couvrent les règles clés.",
    ctaPrimary: 'Lire les articles gratuits',
    ctaSecondary: 'Comparer les prop firms',
  },
};

type Strings = typeof T.en;

const whatYouGetIcons: LucideIcon[] = [FileText, AlertTriangle, CheckCircle2, Play, Download, HelpCircle];

// =============================================================================
// STYLE RECIPES
// =============================================================================

const CARD =
  'relative overflow-hidden rounded-2xl border border-border bg-bg-elevated p-5 shadow-[0_1px_2px_rgba(28,25,23,0.05),0_10px_28px_-16px_rgba(28,25,23,0.22)] dark:bg-gradient-to-b dark:from-white/[0.035] dark:to-transparent dark:shadow-none';
const BTN_PRIMARY =
  'flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-accent-hover px-4 text-sm font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(4,35,26,0.2)] hover:brightness-105';
const BTN_SECONDARY =
  'flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-border-hover bg-bg-elevated px-4 text-sm font-semibold text-text-primary hover:border-text-primary dark:bg-transparent';
const BTN_DISABLED =
  'flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-border-hover bg-bg-elevated px-4 text-sm font-semibold text-text-muted opacity-70 dark:bg-transparent';
const BADGE = 'inline-flex h-5 items-center rounded-md px-1.5 text-[11px] font-semibold';
const BADGE_BLUE = `${BADGE} bg-sky-500/10 text-sky-800 dark:text-sky-300`;
const SECTION_TITLE = 'font-display text-xl font-extrabold tracking-tight text-text-primary mt-10 mb-4';

const difficultyClass: Record<Difficulty, string> = {
  Easy: 'bg-accent/15 text-accent',
  Medium: 'bg-deal-subtle text-deal',
  Hard: 'bg-rose-500/10 text-rose-700 dark:text-rose-300/80',
};

// =============================================================================
// COMPONENTS
// =============================================================================

function Breadcrumb({ t, href }: { t: Strings; href: (p: string) => string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[13px] text-text-muted">
      <Link href={href('/')} className="flex items-center gap-1 hover:text-text-primary">
        <Home className="h-3.5 w-3.5" />
        {t.home}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-text-secondary" aria-current="page">{t.crumb}</span>
    </nav>
  );
}

function PropFirmCard({ firm, t }: { firm: typeof propFirms[number]; t: Strings }) {
  return (
    <div className={`${CARD} flex flex-col`}>
      <div className="flex items-start gap-3">
        <div className="flex h-[42px] w-[42px] flex-none items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5">
          <span aria-hidden className="font-display text-lg font-bold text-accent">{firm.name.charAt(0)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold text-text-primary">{firm.name}</h3>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className={`${BADGE} ${difficultyClass[firm.difficulty]}`}>{t.rules[firm.difficulty]}</span>
            {firm.popular && <span className={`${BADGE} bg-accent/15 text-accent`}>{t.popular}</span>}
          </div>
        </div>
        <span className={BADGE_BLUE}>{t.soon}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[15px] font-bold tabular-nums text-text-primary">{GUIDE_PRICE}</span>
      </div>

      <button type="button" disabled aria-disabled="true" className={`${BTN_DISABLED} mt-3`}>
        <Lock className="h-4 w-4" />
        {t.getGuide}
      </button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function RulesExplainedPage() {
  const params = useParams();
  const rawLocale = params?.locale;
  const locale = (Array.isArray(rawLocale) ? rawLocale[0] : rawLocale) || 'en';
  const t: Strings = locale === 'fr' ? T.fr : T.en;
  const href = (p: string) => (locale === 'en' ? p : `/${locale}${p === '/' ? '' : p}`);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredFirms = propFirms.filter(firm =>
    firm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <section className="px-4 pt-5 pb-3">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb t={t} href={href} />
          <h1 className="font-display text-[28px] font-extrabold leading-9 tracking-tight text-text-primary sm:text-h2">
            {t.title}
          </h1>
          <p className="mt-1 max-w-3xl text-small text-text-secondary">{t.subtitle}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-text-muted">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono font-semibold tabular-nums text-text-primary">{propFirms.length}</span> {t.trustFirms}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono font-semibold tabular-nums text-text-primary">{GUIDE_PRICE}</span> {t.trustPrice}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t.trustSoon}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        {/* What you get */}
        <h2 className={SECTION_TITLE}>{t.whatTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.whatYouGet.map((item, index) => {
            const Icon = whatYouGetIcons[index] ?? FileText;
            return (
              <div key={index} className={`${CARD} flex gap-3 p-4`}>
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-accent/15">
                  <Icon className="h-[18px] w-[18px] text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
                  <p className="mt-0.5 text-[13px] leading-5 text-text-muted">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Firms grid */}
        <div className="mt-10 mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-text-primary">{t.chooseTitle}</h2>
            <p className="mt-1 text-[13px] text-text-secondary">
              {t.chooseSub} <span className="font-mono font-semibold tabular-nums text-text-primary">{GUIDE_PRICE}</span>.
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              className="min-h-11 w-full rounded-xl border border-border-hover bg-bg-elevated pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none dark:bg-transparent"
            />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-sky-700/40 bg-sky-500/10 px-3.5 py-2.5 text-[13px] font-medium text-sky-800 dark:border-sky-400/50 dark:text-sky-300">
          <Lock className="h-4 w-4 flex-none" />
          {t.soonBanner}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFirms.map((firm) => (
            <PropFirmCard key={firm.id} firm={firm} t={t} />
          ))}
        </div>

        {filteredFirms.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-text-muted">{t.noResults} &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {/* Bundle (not yet available) */}
        <div className={`${CARD} mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`${BADGE} bg-accent/15 text-accent`}>
                <Layers className="mr-1 h-3 w-3" />
                {t.bundleTag}
              </span>
              <span className={BADGE_BLUE}>{t.soon}</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight text-text-primary">{t.bundleTitle}</h3>
            <p className="mt-1 text-[13px] text-text-secondary">{t.bundleText}</p>
            <p className="mt-2 font-mono text-[22px] font-bold tabular-nums tracking-tight text-text-primary">{BUNDLE_PRICE}</p>
          </div>
          <div className="md:w-56">
            <button type="button" disabled aria-disabled="true" className={BTN_DISABLED}>
              <Lock className="h-4 w-4" />
              {t.getAll}
            </button>
          </div>
        </div>

        {/* Final CTA */}
        <div className={`${CARD} mt-10 p-6 text-center sm:p-8`}>
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400" />
          <h2 className="font-display text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">{t.ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">{t.ctaText}</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={href('/blog')} className={BTN_PRIMARY}>
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={href('/compare')} className={BTN_SECONDARY}>
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
