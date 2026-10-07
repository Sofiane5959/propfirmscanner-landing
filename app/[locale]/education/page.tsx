'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Home, ChevronRight, BookOpen, Trophy,
  CheckCircle2, Play, Users, Check, X,
  Award, Loader2, ArrowRight, Headphones, Infinity as InfinityIcon,
} from 'lucide-react';

// =============================================================================
// LOCALE
// =============================================================================
const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];
function getLocaleFromPath(pathname: string): Locale {
  const s = pathname.split('/')[1];
  return locales.includes(s as Locale) ? (s as Locale) : 'en';
}

// 'en' n'a pas de préfixe, les autres locales en ont un.
function localeHref(locale: string, p: string) {
  return locale === 'en' ? p : `/${locale}${p}`;
}

// =============================================================================
// COURSES DATA
// =============================================================================
const courses = [
  {
    id: 'fundamentals',
    productType: 'course_fundamentals',
    title: 'Prop Firm Fundamentals',
    subtitle: 'For Beginners',
    price: 69.99,
    originalPrice: 149.99,
    description: 'Everything you need to know to start your prop firm journey. Perfect for traders who are new to funded accounts.',
    duration: '~2 hours',
    lessons: 10,
    features: [
      'What are prop firms & how they work',
      'Understanding challenge rules',
      'Basic risk management (5 golden rules)',
      'Choosing your first prop firm',
      'Account setup walkthrough',
      'Common beginner mistakes to avoid',
      'Introduction to trading psychology',
      'Payout process explained',
    ],
    icon: BookOpen,
    live: true,
    courseUrl: '/education/fundamentals',
  },
  {
    id: 'mastery',
    productType: null,
    title: 'Prop Firm Mastery',
    subtitle: 'Advanced Strategies',
    price: 199,
    originalPrice: 499.99,
    description: 'Advanced strategies and techniques used by consistently funded traders. Take your prop firm trading to the next level.',
    duration: '12+ hours',
    lessons: 36,
    features: [
      'Advanced risk management systems',
      'Multi-account strategies',
      'Scaling funded accounts',
      'Drawdown optimization techniques',
      'Psychology of funded trading',
      'Building consistent edge',
      'News trading strategies',
      'EA & automation integration',
      'Tax optimization for traders',
      'Building a trading business',
    ],
    icon: Trophy,
    live: false,
    courseUrl: null,
  },
];

type Course = (typeof courses)[number];

const benefitIcons = [Headphones, Users, Award, InfinityIcon];

// =============================================================================
// TEXTS (FR + EN ; les autres locales retombent sur EN)
// =============================================================================
const T = {
  en: {
    home: 'Home',
    education: 'Education',
    title: 'PropFirmScanner Academy',
    subtitle: 'Learn to pass your challenge and keep your funded account.',
    trust: ['Instant access after payment', 'Secure payment with Stripe', 'Lifetime access, updates included'],
    paymentTitle: 'Payment confirmed',
    paymentText: 'Your course is now unlocked. Start learning below.',
    close: 'Close',
    ownedText: 'You have access — pick up where you left off',
    continue: 'Continue',
    continueLearning: 'Continue learning',
    level: { fundamentals: 'Beginner', mastery: 'Advanced' } as Record<string, string>,
    pillLive: 'Available',
    pillSoon: 'Coming soon · waitlist',
    pitch: {
      fundamentals: 'Everything to pass your first challenge: rules, risk management, choosing a firm.',
      mastery: 'Scaling accounts, multi-firm setups, drawdown optimisation: the method to trade funded for a living.',
    } as Record<string, string>,
    duration: 'Duration',
    durationValue: { fundamentals: '~2 h', mastery: '12 h+' } as Record<string, string>,
    lessons: 'Lessons',
    access: 'Access',
    lifetime: 'Lifetime',
    finalPrice: 'Final price',
    features: null as Record<string, string[]> | null,
    earlyBird: 'early bird price for the waitlist',
    save: 'Save',
    buy: 'Start the course',
    processing: 'Processing…',
    buyError: 'Something went wrong. Please try again.',
    connError: 'Connection error. Please try again.',
    alreadyBought: 'Already purchased? Access here',
    emailPlaceholder: 'your@email.com',
    emailLabel: 'Your email',
    join: 'Join the waitlist',
    joinedTitle: "You're on the list!",
    joinedText: "We'll email you first, at the early bird price.",
    joinError: 'Something went wrong. Try again.',
    includedTitle: "What's included",
    benefits: [
      { title: 'Audio lessons', description: 'Listen on the go and pick up where you left off.' },
      { title: 'Private Discord', description: 'Ask your questions to other students and the team.' },
      { title: 'Interactive quizzes', description: 'Check you master each rule before your challenge.' },
      { title: 'Lifetime access', description: 'Updates included when firm rules change.' },
    ],
    programTitle: 'Curriculum — Fundamentals',
    ctaTitle: 'Ready to pass your challenge?',
    ctaText: 'Start with Prop Firm Fundamentals: the rules, the risk and the right firm, before you pay for a challenge.',
    compare: 'Compare prop firms',
  },
  fr: {
    home: 'Accueil',
    education: 'Éducation',
    title: 'Académie PropFirmScanner',
    subtitle: 'Apprends à passer ton challenge et à garder ton compte financé.',
    trust: ['Accès immédiat après paiement', 'Paiement sécurisé Stripe', 'Accès à vie et mises à jour incluses'],
    paymentTitle: 'Paiement confirmé',
    paymentText: 'Ta formation est débloquée. Tu peux commencer ci-dessous.',
    close: 'Fermer',
    ownedText: "Tu as accès — reprends où tu t'es arrêté",
    continue: 'Reprendre',
    continueLearning: 'Reprendre la formation',
    level: { fundamentals: 'Débutant', mastery: 'Avancé' } as Record<string, string>,
    pillLive: 'Disponible',
    pillSoon: "Bientôt · liste d'attente",
    pitch: {
      fundamentals: 'Tout pour réussir ton premier challenge : règles, gestion du risque, choix de la firme.',
      mastery: 'Scaler ses comptes, multi-firmes, optimiser le drawdown : la méthode pour vivre du trading financé.',
    } as Record<string, string>,
    duration: 'Durée',
    durationValue: { fundamentals: '~2 h', mastery: '12 h+' } as Record<string, string>,
    lessons: 'Leçons',
    access: 'Accès',
    lifetime: 'À vie',
    finalPrice: 'Prix final',
    features: {
      fundamentals: [
        'Comment marchent les prop firms',
        'Comprendre les règles du challenge',
        "Gestion du risque (5 règles d'or)",
        'Choisir sa première firme',
        'Configurer son compte',
        'Erreurs de débutant à éviter',
        'Introduction à la psychologie du trading',
        'Le processus de paiement expliqué',
      ],
      mastery: [
        'Gestion du risque avancée',
        'Stratégies multi-comptes',
        'Scaler un compte financé',
        'Optimiser le drawdown',
        'Psychologie du trading financé',
        'Construire un edge régulier',
        'Trading de news',
        'EAs et automatisation',
        'Optimisation fiscale pour traders',
        'Construire une activité de trading',
      ],
    } as Record<string, string[]> | null,
    earlyBird: "prix early bird pour la liste d'attente",
    save: 'Économise',
    buy: 'Commencer la formation',
    processing: 'Redirection…',
    buyError: 'Un problème est survenu. Réessaie.',
    connError: 'Erreur de connexion. Réessaie.',
    alreadyBought: 'Déjà acheté ? Accède ici',
    emailPlaceholder: 'ton@email.com',
    emailLabel: 'Ton email',
    join: 'Rejoindre la liste',
    joinedTitle: 'Tu es sur la liste !',
    joinedText: 'On te prévient en premier, au prix early bird.',
    joinError: 'Un problème est survenu. Réessaie.',
    includedTitle: 'Ce qui est inclus',
    benefits: [
      { title: 'Leçons audio', description: "Écoute dans les transports, reprends où tu t'es arrêté." },
      { title: 'Discord privé', description: "Pose tes questions aux autres élèves et à l'équipe." },
      { title: 'Quiz interactifs', description: 'Vérifie que tu maîtrises chaque règle avant ton challenge.' },
      { title: 'Accès à vie', description: 'Mises à jour incluses quand les règles des firmes changent.' },
    ],
    programTitle: 'Programme — Fundamentals',
    ctaTitle: 'Prêt à passer ton challenge ?',
    ctaText: 'Commence par Prop Firm Fundamentals : les règles, le risque et la bonne firme, avant de payer un challenge.',
    compare: 'Comparer les prop firms',
  },
};

type Texts = typeof T.en;
function getT(locale: string): Texts {
  return locale === 'fr' ? T.fr : T.en;
}
function featuresFor(t: Texts, course: Course): string[] {
  return t.features?.[course.id] ?? course.features;
}

// =============================================================================
// CLASS RECIPES
// =============================================================================
const btnPrimary =
  'flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-accent-hover px-4 text-sm font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(4,35,26,0.2)] hover:brightness-105 disabled:opacity-60';
const btnSecondary =
  'flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-border-hover bg-bg-elevated px-4 text-sm font-semibold text-text-primary hover:border-text-primary dark:bg-transparent';
const btnBlue =
  'flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50 dark:bg-sky-400 dark:text-slate-950';
const card =
  'relative overflow-hidden rounded-2xl border bg-bg-elevated p-5 shadow-[0_1px_2px_rgba(28,25,23,0.05),0_10px_28px_-16px_rgba(28,25,23,0.22)] dark:bg-gradient-to-b dark:from-white/[0.035] dark:to-transparent dark:shadow-none';
const sectionHeading = 'font-display text-xl font-extrabold tracking-tight text-text-primary mt-10 mb-4';

// =============================================================================
// PAYMENT SUCCESS BANNER
// =============================================================================
function PaymentSuccessBanner({ t }: { t: Texts }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('payment=success')) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-5">
      <div role="status" className="flex items-start gap-3 rounded-2xl border border-accent-border bg-accent-subtle p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
          <CheckCircle2 className="h-5 w-5 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-base font-bold text-text-primary">{t.paymentTitle}</p>
          <p className="text-sm text-text-secondary">{t.paymentText}</p>
        </div>
        <button
          onClick={() => setShow(false)}
          aria-label={t.close}
          className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// BUY BUTTON
// =============================================================================
function BuyButton({ productType, t, className = '' }: { productType: string; t: Texts; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t.buyError);
        setLoading(false);
      }
    } catch {
      setError(t.connError);
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <button onClick={handleBuy} disabled={loading} className={`${btnPrimary} w-full text-[15px]`}>
        {loading
          ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.processing}</>
          : <>{t.buy} <ArrowRight className="h-4 w-4" /></>}
      </button>
      {error && <span className="text-xs text-rose-700 dark:text-rose-300/80">{error}</span>}
    </div>
  );
}

// =============================================================================
// CONTINUE LEARNING BUTTON
// =============================================================================
function ContinueLearningButton({ courseUrl, locale, label, className = '' }: { courseUrl: string; locale: string; label: string; className?: string }) {
  return (
    <Link href={localeHref(locale, courseUrl)} className={`${btnPrimary} ${className}`}>
      <Play className="h-4 w-4" />
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

// =============================================================================
// WAITLIST INLINE
// =============================================================================
function WaitlistInCard({ t }: { t: Texts }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" className="flex items-center gap-3 rounded-xl border border-accent-border bg-accent-subtle p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-semibold text-accent">{t.joinedTitle}</p>
          <p className="text-xs text-text-secondary">{t.joinedText}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="waitlist-email">{t.emailLabel}</label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
          disabled={status === 'loading'}
          className="min-h-11 w-full flex-1 rounded-xl border border-border-hover bg-bg-base px-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-700 dark:focus:border-sky-400 dark:focus:ring-sky-400"
        />
        <button type="submit" disabled={status === 'loading' || !email.trim()} className={btnBlue}>
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : t.join}
        </button>
      </div>
      {status === 'error' && <p className="text-xs text-rose-700 dark:text-rose-300/80">{t.joinError}</p>}
    </form>
  );
}

// =============================================================================
// COURSE CARD
// =============================================================================
function CourseCard({
  course,
  hasFundamentals,
  locale,
  authLoading,
  t,
}: {
  course: Course;
  hasFundamentals: boolean;
  locale: string;
  authLoading: boolean;
  t: Texts;
}) {
  const isFundamentals = course.id === 'fundamentals';
  const featured = course.live;
  const userOwns = isFundamentals && hasFundamentals;
  const savePct = Math.round((1 - course.price / course.originalPrice) * 100);

  const facts = [
    { label: t.duration, value: t.durationValue[course.id] ?? course.duration },
    { label: t.lessons, value: String(course.lessons) },
    course.live
      ? { label: t.access, value: t.lifetime }
      : { label: t.finalPrice, value: `$${course.originalPrice}` },
  ];

  return (
    <article
      className={`${card} flex flex-col gap-4 ${featured ? 'border-accent-border' : 'border-border hover:border-border-hover'}`}
    >
      {featured && (
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-text-muted">
          {t.level[course.id]}
        </span>
        {course.live ? (
          <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-accent/15 px-2 text-[11px] font-semibold text-accent">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            {userOwns ? <><Check className="h-3 w-3" />{t.access}</> : t.pillLive}
          </span>
        ) : (
          <span className="inline-flex h-6 items-center rounded-md bg-sky-500/10 px-2 text-[11px] font-semibold text-sky-800 dark:text-sky-300">
            {t.pillSoon}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-display text-[22px] font-extrabold leading-7 tracking-tight text-text-primary">{course.title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t.pitch[course.id] ?? course.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {facts.map((f) => (
          <div key={f.label} className="bg-bg-base px-3 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">{f.label}</p>
            <p className="mt-1 font-mono text-base font-bold tabular-nums tracking-tight text-text-primary">{f.value}</p>
          </div>
        ))}
      </div>

      <ul className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {featuresFor(t, course).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[13px] text-text-secondary">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-t border-border pt-4">
        <span className="font-mono text-[30px] font-extrabold tabular-nums tracking-tight text-text-primary">${course.price}</span>
        <s className="font-mono text-sm tabular-nums text-text-muted">${course.originalPrice}</s>
        <span className="inline-flex h-5 items-center rounded-md bg-accent/15 px-1.5 font-mono text-[11px] font-semibold tabular-nums text-accent">
          −{savePct}%
        </span>
        {!course.live && <span className="w-full text-[13px] text-text-muted">{t.earlyBird}</span>}
      </div>

      {course.live && course.productType ? (
        <div className="flex flex-col gap-2">
          {authLoading ? (
            <div className="flex min-h-12 items-center justify-center rounded-xl border border-border">
              <Loader2 className="h-4 w-4 animate-spin text-text-secondary" />
            </div>
          ) : userOwns ? (
            <ContinueLearningButton courseUrl={course.courseUrl!} locale={locale} label={t.continueLearning} />
          ) : (
            <>
              <BuyButton productType={course.productType} t={t} />
              {course.courseUrl && (
                <Link
                  href={localeHref(locale, course.courseUrl)}
                  className="inline-flex min-h-11 items-center justify-center text-xs text-text-secondary underline underline-offset-2 hover:text-accent"
                >
                  {t.alreadyBought}
                </Link>
              )}
            </>
          )}
        </div>
      ) : (
        <WaitlistInCard t={t} />
      )}
    </article>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================
export default function EducationPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = getT(locale);
  const { user, isLoading: authLoading } = useAuth();
  const supabase = createClientComponentClient();

  const [hasFundamentals, setHasFundamentals] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('has_course_fundamentals')
        .eq('id', user.id)
        .single();
      setHasFundamentals(data?.has_course_fundamentals ?? false);
      setProfileLoading(false);
    };
    fetchProfile();
  }, [user, supabase]);

  const isLoading = authLoading || profileLoading;
  const fundamentals = courses[0];

  return (
    <div className="min-h-screen bg-bg-base">
      <PaymentSuccessBanner t={t} />

      {/* HEADER */}
      <section className="px-4 pt-5 pb-3">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[13px] text-text-muted">
            <Link href={localeHref(locale, '/')} className="flex items-center gap-1 hover:text-text-primary">
              <Home className="h-3.5 w-3.5" /> {t.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-secondary">{t.education}</span>
          </nav>
          <h1 className="font-display text-[28px] font-extrabold leading-9 tracking-tight text-text-primary sm:text-h2">
            {t.title}
          </h1>
          <p className="mt-1 text-small text-text-secondary">{t.subtitle}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-text-muted">
            {t.trust.map((item, i) => (
              <span key={item} className="flex items-center gap-1.5">
                {i === 0 && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        {/* OWNED COURSE QUICK ACCESS */}
        {!isLoading && hasFundamentals && (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-accent-border bg-accent-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{fundamentals.title}</p>
                <p className="text-xs text-accent">{t.ownedText}</p>
              </div>
            </div>
            <ContinueLearningButton courseUrl="/education/fundamentals" locale={locale} label={t.continue} className="shrink-0" />
          </div>
        )}

        {/* COURSES */}
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              hasFundamentals={hasFundamentals}
              locale={locale}
              authLoading={isLoading}
              t={t}
            />
          ))}
        </div>

        {/* WHAT'S INCLUDED */}
        <h2 className={sectionHeading}>{t.includedTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.map((benefit, i) => {
            const Icon = benefitIcons[i];
            return (
              <div key={benefit.title} className={`${card} border-border p-4`}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
                  <Icon className="h-[18px] w-[18px] text-accent" />
                </div>
                <p className="text-sm font-semibold text-text-primary">{benefit.title}</p>
                <p className="mt-1 text-[13px] text-text-muted">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* CURRICULUM */}
        <h2 className={sectionHeading}>{t.programTitle}</h2>
        <ol className={`${card} divide-y divide-border border-border p-0`}>
          {featuresFor(t, fundamentals).map((feature, i) => (
            <li key={feature} className="flex items-center gap-4 px-5 py-3.5">
              <span className="font-mono text-sm font-bold tabular-nums text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium text-text-primary">{feature}</span>
            </li>
          ))}
        </ol>

        {/* CTA BOTTOM */}
        <div className={`${card} mt-10 border-border p-6 text-center sm:p-8`}>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-text-primary">{t.ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">{t.ctaText}</p>
          <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-start">
            {!isLoading && hasFundamentals ? (
              <ContinueLearningButton courseUrl="/education/fundamentals" locale={locale} label={t.continueLearning} />
            ) : (
              <BuyButton productType="course_fundamentals" t={t} className="sm:w-64" />
            )}
            <Link href={localeHref(locale, '/compare')} className={btnSecondary}>
              {t.compare}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
